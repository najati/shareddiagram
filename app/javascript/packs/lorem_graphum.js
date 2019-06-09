

export const loremGraphum = `
digraph G {
\tsubgraph cluster_0 {
\t\tstyle=filled;
\t\tcolor=lightgrey;
\t\tnode [style=filled,color=white];
\t\ta0 -> a1 -> a2 -> a3;
\t\tlabel = "process #1";
\t}

\tsubgraph cluster_1 {
\t\tnode [style=filled];
\t\tb0 -> b1 -> b2 -> b3;
\t\tlabel = "process #2";
\t\tcolor=blue
\t}
\tstart -> a0;
\tstart -> b0;
\ta1 -> b3;
\tb2 -> a3;
\ta3 -> a0;
\ta3 -> end;
\tb3 -> end;

\tstart [shape=Mdiamond];
\tend [shape=Msquare];
}
`;
