import { useCallback, useEffect, useState } from "react";

export type Project = {
    id: string;
    name: string;
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

export type CreateProjectInput = {
    name: string;
};

export type CreateProjectOptions = UseProjectsOptions;

export type UseCreateProjectState = {
    creating: boolean;
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
        runtimeGlobal.process?.env?.API_URL ??
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
