
import React, { useEffect, useRef } from 'react';
import { WellBeingData } from '../../types';
import { INDIAN_STATES } from '../../constants';

// d3 is loaded from CDN and available on the window object
declare const d3: any;

interface WellBeingHeatmapProps {
  data: WellBeingData[];
}

const WellBeingHeatmap: React.FC<WellBeingHeatmapProps> = ({ data }) => {
  const ref = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const dataMap = new Map(data.map(d => [d.state, d.impactScore]));
    const fullData = INDIAN_STATES.map(state => ({
      state,
      impactScore: dataMap.get(state) ?? 0
    }));

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = ref.current?.parentElement?.clientWidth || 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    
    svg.attr("width", width).attr("height", height);

    const numCols = 7;
    const numRows = Math.ceil(fullData.length / numCols);
    const cellWidth = (width - margin.left - margin.right) / numCols;
    const cellHeight = (height - margin.top - margin.bottom) / numRows;
    const cellSize = Math.min(cellWidth, cellHeight) - 4;

    const colorScale = d3.scaleLinear()
      .domain([-10, 0, 10])
      .range(["#d73027", "#fee08b", "#1a9641"]);

    const tooltip = d3.select(tooltipRef.current);
    
    const cells = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .selectAll("g")
        .data(fullData)
        .enter()
        .append("g")
        .attr("transform", (d: any, i: number) => {
            const col = i % numCols;
            const row = Math.floor(i / numCols);
            return `translate(${col * cellWidth}, ${row * cellHeight})`;
        });

    cells.append("rect")
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("fill", (d: any) => colorScale(d.impactScore))
      .style("stroke", "#fff")
      .style("stroke-width", 2)
      .on("mouseover", function(event: any, d: any) {
        d3.select(this).style("stroke", "black");
        tooltip.style("opacity", 1)
          .html(`<p class="font-bold text-slate-800 mb-1">${d.state}</p><p class="text-slate-600">Impact: <span class="font-semibold">${d.impactScore.toFixed(2)}</span></p>`)
          .style("left", `${event.pageX + 15}px`)
          .style("top", `${event.pageY - 60}px`);
      })
      .on("mouseout", function() {
        d3.select(this).style("stroke", "#fff");
        tooltip.style("opacity", 0);
      });

    cells.append("text")
        .attr("x", cellSize / 2)
        .attr("y", cellSize / 2)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", d => Math.abs(d.impactScore) > 6 ? "white" : "black")
        .text((d: any) => d.state.substring(0, 3).toUpperCase());

  }, [data]);

  return (
    <div className="relative w-full">
      <svg ref={ref}></svg>
      <div 
        ref={tooltipRef} 
        className="absolute text-sm bg-white p-3 border border-slate-200 rounded-lg shadow-lg pointer-events-none"
        style={{ opacity: 0, transition: 'opacity 0.2s' }}>
      </div>
    </div>
  );
};

export default WellBeingHeatmap;