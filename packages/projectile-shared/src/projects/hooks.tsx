import { useState } from "react";

export function useProjects({ sessionId }: { sessionId?: string }) {
    const reload = () => {
       fetch()
    };
    const [projects, setProjects] = useState<{loaded: boolean, data: any[], reload: () => void}>({loaded: false, data: [], reload});
    
    return {
        projects,
        setProjects,
    };
}
