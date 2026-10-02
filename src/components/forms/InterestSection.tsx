import { InterestForm } from "@/components/forms/InterestForm";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SectionHeading as SectionHeadingContent } from "@/models/content";
import type { ProjectOption } from "@/models/project";

interface InterestSectionProps {
  heading: SectionHeadingContent;
  projectOptions: ProjectOption[];
  defaultProject?: string;
}

export function InterestSection({ heading, projectOptions, defaultProject }: InterestSectionProps) {
  return (
    <Reveal as="section" id="register-interest" className="section section--dark">
      <div className="container container--narrow">
        <SectionHeading heading={heading} align="center" />
        <InterestForm projectOptions={projectOptions} defaultProject={defaultProject} />
      </div>
    </Reveal>
  );
}
