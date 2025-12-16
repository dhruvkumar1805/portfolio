import { projects } from "./projects";
import { ProjectItem } from "./ProjectItem";

export function ProjectList() {
  return (
    <div className="mt-22 space-y-6">
      {projects.map((project) => (
        <ProjectItem key={project.name} {...project} />
      ))}
    </div>
  );
}
