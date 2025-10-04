import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './KnowledgeGraph.css';

export type KGNode = {
  id: string;
  label: string;
  type?: string;
  x?: number;
  y?: number;
};

export type KGLink = {
  id: string;
  source: string;
  target: string;
  label?: string;
};

type Props = {
  width?: number;
  height?: number;
  initialNodes?: KGNode[];
  initialLinks?: KGLink[];
  onChange?: (nodes: KGNode[], links: KGLink[]) => void;
};

const STORAGE_KEY = 'starlab_kg_v1';

function uid(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 9);
}

export default function KnowledgeGraph({
  width = 900,
  height = 600,
  initialNodes = [],
  initialLinks = [],
  onChange,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [nodes, setNodes] = useState<KGNode[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw).nodes as KGNode[];
    } catch (e) {}
    return initialNodes.length ? initialNodes : [];
  });
  const [links, setLinks] = useState<KGLink[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw).links as KGLink[];
    } catch (e) {}
    return initialLinks.length ? initialLinks : [];
  });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [creatingEdgeFrom, setCreatingEdgeFrom] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, links }));
    onChange && onChange(nodes, links);
  }, [nodes, links]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const sim = d3
      .forceSimulation(nodes as any)
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'link',
        d3
          .forceLink(links as any)
          .id((d: any) => d.id)
          .distance(120)
      )
      .on('tick', ticked as any);

    // zoom
    const g = svg.append('g');

    svg.call(
      d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.2, 3])
        .on('zoom', (event) => {
          g.attr('transform', event.transform.toString());
        })
    );

    // links
    const linkG = g.append('g').attr('class', 'links');
    const nodeG = g.append('g').attr('class', 'nodes');
    const labelG = g.append('g').attr('class', 'labels');

    function update() {
      // links
      const link = linkG.selectAll('line').data(links, (d: any) => d.id);
      link.exit().remove();
      const linkEnter = link
        .enter()
        .append('line')
        .attr('stroke', '#999')
        .attr('stroke-width', 2);
      link.merge(linkEnter as any);

      // nodes
      const node = nodeG.selectAll('g.node').data(nodes, (d: any) => d.id);
      node.exit().remove();
      const nodeEnter = node.enter().append('g').attr('class', 'node');

      nodeEnter
        .append('circle')
        .attr('r', 22)
        .attr('fill', '#1f77b4')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .on('click', (event: any, d: any) => {
          event.stopPropagation();
          if (creatingEdgeFrom) {
            if (creatingEdgeFrom !== d.id) {
              // create link
              const newLink: KGLink = {
                id: uid('link_'),
                source: creatingEdgeFrom,
                target: d.id,
                label: '',
              };
              setLinks((s) => [...s, newLink]);
            }
            setCreatingEdgeFrom(null);
          } else {
            setSelectedNodeId(d.id === selectedNodeId ? null : d.id);
          }
        })
        .call(
          d3
            .drag<SVGCircleElement, any>()
            .on('start', (event: any, d: any) => {
              if (!event.active) sim.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            })
            .on('drag', (event: any, d: any) => {
              d.fx = event.x;
              d.fy = event.y;
            })
            .on('end', (event: any, d: any) => {
              if (!event.active) sim.alphaTarget(0);
              d.fx = null;
              d.fy = null;
            })
        );

      nodeEnter
        .append('text')
        .attr('dy', 4)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .style('pointer-events', 'none')
        .text((d: any) => d.label.substring(0, 12));

      node.merge(nodeEnter as any);

      // labels for links
      const linkLabel = labelG.selectAll('text').data(links, (d: any) => d.id);
      linkLabel.exit().remove();
      const linkLabelEnter = linkLabel.enter().append('text').attr('class', 'linkLabel').text((d: any) => d.label || '');
      linkLabel.merge(linkLabelEnter as any);
    }

    function ticked() {
      linkG
        .selectAll('line')
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodeG
        .selectAll('g.node')
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);

      labelG
        .selectAll('text')
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2 - 6);
    }

    // background click to clear selection or create nodes
    const dbl = (event: any) => {
      const coords = d3.pointer(event as any);
      const newNode: KGNode = { id: uid('n_'), label: 'New node', x: coords[0], y: coords[1] };
      setNodes((s) => [...s, newNode]);
    };
    svg.on('dblclick', dbl);

    update();

    return () => {
      sim.stop();
      svg.on('dblclick', null);
    };
    // re-run when nodes/links change
  }, [nodes, links, width, height]);

  function startCreateEdge() {
    if (selectedNodeId) setCreatingEdgeFrom(selectedNodeId);
  }

  function removeSelected() {
    if (!selectedNodeId) return;
    setLinks((s) => s.filter((l) => l.source !== selectedNodeId && l.target !== selectedNodeId));
    setNodes((s) => s.filter((n) => n.id !== selectedNodeId));
    setSelectedNodeId(null);
  }

  function updateLabelForSelected(label: string) {
    if (!selectedNodeId) return;
    setNodes((s) => s.map((n) => (n.id === selectedNodeId ? { ...n, label } : n)));
  }

  return (
    <div className="kg-wrap">
      <div className="kg-canvas">
        <svg ref={svgRef} width={width} height={height} />
      </div>
      <div className="kg-side">
        <h3>Grafo — Biologia Espacial</h3>
        <p>Instruções:</p>
        <ul>
          <li>Duplo-clique no canvas para criar um nó.</li>
          <li>Clique num nó para selecionar.</li>
          <li>Clique em <b>Create Edge</b> depois clique em outro nó para conectar.</li>
          <li>Arraste nós para reposicionar.</li>
        </ul>

        <div className="kg-controls">
          <button onClick={() => setNodes([])}>Limpar nós</button>
          <button onClick={() => setLinks([])}>Limpar arestas</button>
          <button onClick={startCreateEdge} disabled={!selectedNodeId} className={creatingEdgeFrom ? 'active' : ''}>
            Create Edge
          </button>
          <button onClick={removeSelected} disabled={!selectedNodeId}>
            Remover selecionado
          </button>
        </div>

        <div className="kg-edit">
          <h4>Editar nó</h4>
          {selectedNodeId ? (
            <>
              <label>Label</label>
              <input
                value={nodes.find((n) => n.id === selectedNodeId)?.label || ''}
                onChange={(e) => updateLabelForSelected(e.target.value)}
              />
              <p>ID: {selectedNodeId}</p>
            </>
          ) : (
            <p>Nenhum nó selecionado</p>
          )}
        </div>

        <div className="kg-export">
          <h4>Export / Import</h4>
          <div style={{ marginBottom: 8 }}>
            <button
              onClick={async () => {
                // save to backend
                const title = prompt('Título do grafo', 'Meu grafo');
                if (!title) return;
                const res = await fetch('/api/graphs', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ title, data: { nodes, links } }),
                });
                const json = await res.json();
                alert('Salvo com id: ' + json.id);
              }}
            >
              Salvar no servidor
            </button>
            <button
              onClick={async () => {
                const res = await fetch('/api/graphs');
                const list = await res.json();
                const id = prompt('Escolha id do grafo:\n' + list.map((l: any) => `${l.id}: ${l.title}`).join('\n'));
                if (!id) return;
                const r2 = await fetch(`/api/graphs/${id}`);
                if (!r2.ok) return alert('Erro ao carregar');
                const js = await r2.json();
                const parsed = JSON.parse(js.data);
                setNodes(parsed.nodes || []);
                setLinks(parsed.links || []);
              }}
            >
              Carregar do servidor
            </button>
          </div>
          <button
            onClick={() => {
              const data = JSON.stringify({ nodes, links }, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'starlab-kg.json';
              a.click();
            }}
          >
            Exportar JSON
          </button>
          <input
            type="file"
            accept="application/json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                try {
                  const data = JSON.parse(reader.result as string);
                  setNodes(data.nodes || []);
                  setLinks(data.links || []);
                } catch (err) {
                  alert('Arquivo inválido');
                }
              };
              reader.readAsText(file);
            }}
          />
        </div>
      </div>
    </div>
  );
}
