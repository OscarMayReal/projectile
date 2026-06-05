import { useCallback, useEffect, useState } from "react";

export type Project = {
    id: string;
    name: string;
    boards?: Board[];
    permissions?: Array<Record<string, unknown>>;
    [key: string]: unknown;
};

export type Board = {
    id: string;
    name: string;
    description: string | null;
    projectId: string;
    [key: string]: unknown;
};

export type UseProjectsState = {
    loaded: boolean;
    loading: boolean;
    data: Project[];
    error: string | null;
};

export type UseProjectsOptions = {
    sessionId?: string;
    apiUrl?: string;
};

export type UseProjectOptions = UseProjectsOptions;

export type UseBoardOptions = UseProjectsOptions;

export type CreateProjectInput = {
    name: string;
};

export type CreateProjectOptions = UseProjectsOptions;

export type UseCreateProjectState = {
    creating: boolean;
    error: string | null;
};

export type CreateBoardInput = {
    name: string;
    description: string;
    projectId: string;
};

export type CreateBoardOptions = UseProjectsOptions;

export type UseCreateBoardState = {
    creating: boolean;
    error: string | null;
};

export type UseProjectState = {
    loaded: boolean;
    loading: boolean;
    data: Project | null;
    error: string | null;
};

const DEFAULT_API_URL = "http://localhost:3001";
const SESSION_COOKIE_NAME = "sessionId";
const runtimeGlobal = globalThis as typeof globalThis & {
    process?: {
        env?: Record<string, string | undefined>;
    };
};

export function getSessionIdFromCookie() {
    if (typeof document === "undefined") {
        return null;
    }

    return document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${SESSION_COOKIE_NAME}=`))
        ?.split("=")[1]
        ?? null;
}

export function getProjectsApiUrl({ apiUrl }: { sessionId?: string; apiUrl?: string } = {}) {
    if (apiUrl) {
        return apiUrl.replace(/\/+$/, "");
    }

    if (typeof document !== "undefined") {
        return "/api";
    }

    return (
        runtimeGlobal.process?.env?.EXPO_PUBLIC_API_URL ??
        runtimeGlobal.process?.env?.NEXT_PUBLIC_API_URL ??
        DEFAULT_API_URL
    ).replace(/\/+$/, "");
}

function buildEndpointUrl(apiUrl: string, pathname: string) {
    if (apiUrl.startsWith("/")) {
        return `${apiUrl.replace(/\/+$/, "")}${pathname}`;
    }

    return new URL(pathname, apiUrl).toString();
}

function appendSearchParams(url: string, params: URLSearchParams) {
    const queryString = params.toString();

    if (!queryString) {
        return url;
    }

    return `${url}${url.includes("?") ? "&" : "?"}${queryString}`;
}

function normalizeSessionId(sessionId?: string | null) {
    const trimmedSessionId = sessionId?.trim();

    return trimmedSessionId ? trimmedSessionId : null;
}

export function useProjects(options: UseProjectsOptions = {}) {
    const [projects, setProjects] = useState<UseProjectsState>({
        loaded: false,
        loading: false,
        data: [],
        error: null,
    });

    const reload = useCallback(async () => {
        const sessionId = normalizeSessionId(
            options.sessionId ?? getSessionIdFromCookie(),
        );

        if (!sessionId) {
            setProjects({
                loaded: true,
                loading: false,
                data: [],
                error: "Missing sessionId",
            });
            return;
        }

        const apiUrl = getProjectsApiUrl({ apiUrl: options.apiUrl });
        const searchParams = new URLSearchParams();

        if (typeof document === "undefined") {
            searchParams.set("sessionId", sessionId);
        }

        const url = appendSearchParams(
            buildEndpointUrl(apiUrl, "/project/list"),
            searchParams,
        );

        setProjects((current) => ({
            ...current,
            loading: true,
            error: null,
        }));

        try {
            const response = await fetch(url, {
                credentials: typeof document !== "undefined" ? "include" : "omit",
            });

            if (!response.ok) {
                throw new Error(`Failed to load projects: ${response.status}`);
            }

            const data = (await response.json()) as Project[];

            setProjects({
                loaded: true,
                loading: false,
                data,
                error: null,
            });
        } catch (error) {
            setProjects({
                loaded: true,
                loading: false,
                data: [],
                error: error instanceof Error ? error.message : "Failed to load projects",
            });
        }
    }, [options.apiUrl, options.sessionId]);

    useEffect(() => {
        void reload();
    }, [reload]);

    return {
        projects,
        reload,
    };
}

export async function getProjectById(
    projectId: string,
    options: UseProjectOptions = {},
) {
    const sessionId = normalizeSessionId(
        options.sessionId ?? getSessionIdFromCookie(),
    );

    if (!sessionId) {
        throw new Error("Missing sessionId");
    }

    if (!projectId.trim()) {
        throw new Error("Missing projectId");
    }

    const apiUrl = getProjectsApiUrl({ apiUrl: options.apiUrl });
    const searchParams = new URLSearchParams();

    if (typeof document === "undefined") {
        searchParams.set("sessionId", sessionId);
    }

    const url = appendSearchParams(
        buildEndpointUrl(apiUrl, `/project/p/${projectId}/get`),
        searchParams,
    );

    const response = await fetch(url, {
        credentials: typeof document !== "undefined" ? "include" : "omit",
    });

    if (!response.ok) {
        throw new Error(`Failed to load project: ${response.status}`);
    }

    return (await response.json()) as Project;
}

export function useProjectById(
    projectId: string,
    options: UseProjectOptions = {},
) {
    const [project, setProject] = useState<{
        loaded: boolean;
        loading: boolean;
        data: Project | null;
        error: string | null;
    }>({
        loaded: false,
        loading: false,
        data: null,
        error: null,
    });

    const reload = useCallback(async () => {
        const normalizedProjectId = projectId.trim();

        if (!normalizedProjectId) {
            setProject({
                loaded: true,
                loading: false,
                data: null,
                error: "Missing projectId",
            });
            return;
        }

        setProject((current) => ({
            ...current,
            loading: true,
            error: null,
        }));

        try {
            const data = await getProjectById(normalizedProjectId, options);

            setProject({
                loaded: true,
                loading: false,
                data,
                error: null,
            });
        } catch (error) {
            setProject({
                loaded: true,
                loading: false,
                data: null,
                error: error instanceof Error ? error.message : "Failed to load project",
            });
        }
    }, [options.apiUrl, options.sessionId, projectId]);

    useEffect(() => {
        void reload();
    }, [reload]);

    return {
        project,
        reload,
    };
}

export async function createProject(
    input: CreateProjectInput,
    options: CreateProjectOptions = {},
) {
    const sessionId = normalizeSessionId(
        options.sessionId ?? getSessionIdFromCookie(),
    );

    if (!sessionId) {
        throw new Error("Missing sessionId");
    }

    const apiUrl = getProjectsApiUrl({ apiUrl: options.apiUrl });
    const requestUrl = buildEndpointUrl(apiUrl, "/project/create");
    const body: Record<string, string> = {
        name: input.name,
    };

    if (typeof document === "undefined") {
        body.sessionId = sessionId;
    }

    const response = await fetch(requestUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: typeof document !== "undefined" ? "include" : "omit",
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`Failed to create project: ${response.status}`);
    }

    return (await response.json()) as Project;
}

export function useCreateProject(options: CreateProjectOptions = {}) {
    const [state, setState] = useState<UseCreateProjectState>({
        creating: false,
        error: null,
    });

    const submit = useCallback(
        async (input: CreateProjectInput) => {
            setState({
                creating: true,
                error: null,
            });

            try {
                const project = await createProject(input, options);

                setState({
                    creating: false,
                    error: null,
                });

                return project;
            } catch (error) {
                const message =
                    error instanceof Error ? error.message : "Failed to create project";

                setState({
                    creating: false,
                    error: message,
                });

                throw error;
            }
        },
        [options.apiUrl, options.sessionId],
    );

    return {
        ...state,
        createProject: submit,
    };
}

export async function createBoard(
    input: CreateBoardInput,
    options: CreateBoardOptions = {},
) {
    const sessionId = normalizeSessionId(
        options.sessionId ?? getSessionIdFromCookie(),
    );

    if (!sessionId) {
        throw new Error("Missing sessionId");
    }

    if (!input.projectId.trim()) {
        throw new Error("Missing projectId");
    }

    const apiUrl = getProjectsApiUrl({ apiUrl: options.apiUrl });
    const requestUrl = buildEndpointUrl(
        apiUrl,
        `/project/p/${input.projectId}/boards/create`,
    );
    const body: Record<string, string> = {
        name: input.name,
        description: input.description,
    };

    if (typeof document === "undefined") {
        body.sessionId = sessionId;
    }

    const response = await fetch(requestUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: typeof document !== "undefined" ? "include" : "omit",
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`Failed to create board: ${response.status}`);
    }

    return (await response.json()) as Board;
}

export function useCreateBoard(options: CreateBoardOptions = {}) {
    const [state, setState] = useState<UseCreateBoardState>({
        creating: false,
        error: null,
    });

    const submit = useCallback(
        async (input: CreateBoardInput) => {
            setState({
                creating: true,
                error: null,
            });

            try {
                const board = await createBoard(input, options);

                setState({
                    creating: false,
                    error: null,
                });

                return board;
            } catch (error) {
                const message =
                    error instanceof Error ? error.message : "Failed to create board";

                setState({
                    creating: false,
                    error: message,
                });

                throw error;
            }
        },
        [options.apiUrl, options.sessionId],
    );

    return {
        ...state,
        createBoard: submit,
    };
}

export async function getBoardById(
    projectId: string,
    boardId: string,
    options: UseBoardOptions = {},
) {
    const sessionId = normalizeSessionId(
        options.sessionId ?? getSessionIdFromCookie(),
    );

    if (!sessionId) {
        throw new Error("Missing sessionId");
    }

    if (!projectId.trim()) {
        throw new Error("Missing projectId");
    }

    if (!boardId.trim()) {
        throw new Error("Missing boardId");
    }

    const apiUrl = getProjectsApiUrl({ apiUrl: options.apiUrl });
    const searchParams = new URLSearchParams();

    if (typeof document === "undefined") {
        searchParams.set("sessionId", sessionId);
    }

    const url = appendSearchParams(
        buildEndpointUrl(apiUrl, `/project/p/${projectId}/b/${boardId}/get`),
        searchParams,
    );

    const response = await fetch(url, {
        credentials: typeof document !== "undefined" ? "include" : "omit",
    });

    if (!response.ok) {
        throw new Error(`Failed to load board: ${response.status}`);
    }

    return (await response.json()) as Board;
}

export function useBoardById(
    projectId: string,
    boardId: string,
    options: UseBoardOptions = {},
) {
    const [board, setBoard] = useState<{
        loaded: boolean;
        loading: boolean;
        data: Board | null;
        error: string | null;
    }>({
        loaded: false,
        loading: false,
        data: null,
        error: null,
    });

    const reload = useCallback(async () => {
        const normalizedProjectId = projectId.trim();
        const normalizedBoardId = boardId.trim();

        if (!normalizedProjectId) {
            setBoard({
                loaded: true,
                loading: false,
                data: null,
                error: "Missing projectId",
            });
            return;
        }

        if (!normalizedBoardId) {
            setBoard({
                loaded: true,
                loading: false,
                data: null,
                error: "Missing boardId",
            });
            return;
        }

        setBoard((current) => ({
            ...current,
            loading: true,
            error: null,
        }));

        try {
            const data = await getBoardById(normalizedProjectId, normalizedBoardId, options);

            setBoard({
                loaded: true,
                loading: false,
                data,
                error: null,
            });
        } catch (error) {
            setBoard({
                loaded: true,
                loading: false,
                data: null,
                error: error instanceof Error ? error.message : "Failed to load board",
            });
        }
    }, [boardId, options.apiUrl, options.sessionId, projectId]);

    useEffect(() => {
        void reload();
    }, [reload]);

    return {
        board,
        reload,
    };
}
