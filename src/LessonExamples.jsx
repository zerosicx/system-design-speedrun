import React, { useState } from "react";
import { ChevronRight, ExternalLink } from "lucide-react";
import apiComparison from "./data/api-comparison.json";

function SourceLink({ source }) {
  return (
    <a
      className="example-source"
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {source.title}
      <ExternalLink size={14} aria-hidden="true" />
    </a>
  );
}

export function CloudExample({ scenario }) {
  const [provider, setProvider] = useState("aws");
  const example = scenario[provider];
  return (
    <section className="panel lesson-enrichment">
      <div className="eyebrow mono">CLOUD EXAMPLE</div>
      <h2>{scenario.title}</h2>
      <div className="cloud-switch" role="group" aria-label="Cloud provider">
        {[
          ["aws", "AWS"],
          ["azure", "Azure"],
        ].map(([id, name]) => (
          <button
            key={id}
            type="button"
            aria-pressed={provider === id}
            onClick={() => setProvider(id)}
          >
            {name}
          </button>
        ))}
      </div>
      <ol className="component-path" aria-label="Component flow">
        {example.path.map((step, i) => (
          <li key={step}>
            {i > 0 && <ChevronRight size={14} aria-hidden="true" />}
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <p>{example.explanation}</p>
      <SourceLink source={example.source} />
      <p className="design-choice">
        <strong>Design trade-off</strong> {scenario.tradeoff}
      </p>
    </section>
  );
}

export function ApiComparison() {
  return (
    <section className="panel lesson-enrichment">
      <h2>RPC, gRPC, REST, and GraphQL</h2>
      <p>
        Imagine a support agent checking order 42. RPC is a way to call remote
        operations, and gRPC implements that idea with a service contract. REST
        organizes an API around resources. GraphQL lets the caller select fields
        from a schema.
      </p>
      <table className="api-table">
        <caption>How would you ask for the order?</caption>
        <thead>
          <tr>
            <th scope="col">Approach</th>
            <th scope="col">Request or service contract</th>
          </tr>
        </thead>
        <tbody>
          {apiComparison.map((row) => (
            <tr key={row.name}>
              <th scope="row">{row.name}</th>
              <td>
                <code>{row.request}</code>
                <p>{row.model}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <table className="api-table">
        <caption>Benefits and trade-offs</caption>
        <thead>
          <tr>
            <th scope="col">Approach</th>
            <th scope="col">Design considerations</th>
          </tr>
        </thead>
        <tbody>
          {apiComparison.map((row) => (
            <tr key={row.name}>
              <th scope="row">{row.name}</th>
              <td>
                <div className="api-decision">
                  <p>
                    <strong>Benefit</strong>
                    {row.benefit}
                  </p>
                  <p>
                    <strong>Trade-off</strong>
                    {row.tradeoff}
                  </p>
                </div>
                <SourceLink source={row.source} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
