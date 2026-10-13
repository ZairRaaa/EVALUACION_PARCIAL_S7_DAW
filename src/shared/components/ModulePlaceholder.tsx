interface Props { title: string; owner: string; tasks: string[] }

export function ModulePlaceholder({ title, owner, tasks }: Props) {
  return (
    <section className="panel">
      <span className="badge">Pendiente de implementación · {owner}</span>
      <h1>{title}</h1>
      <p>La ruta está conectada. Este módulo se desarrollará en su rama asignada.</p>
      <ul>{tasks.map(task => <li key={task}>{task}</li>)}</ul>
    </section>
  );
}
