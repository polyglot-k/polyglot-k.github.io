import { Github, Linkedin } from 'lucide-react';

interface SocialLinksProps {
    github?: string;
    linkedin?: string;
}

export function SocialLinks({ github, linkedin }: SocialLinksProps) {
    return (
        <div className="flex items-center gap-3">
            {github && (
                <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                </a>
            )}
            {linkedin && (
                <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                </a>
            )}
        </div>
    );
}
