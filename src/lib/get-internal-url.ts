interface GetInternalUrlProps {
  nextUrl?: URL;
}

const internalUrlEnv = process.env.NEXT_PUBLIC_INTERNAL_HOST ?? "";
const basePathEnv = process.env.NEXT_PUBLIC_SERVER_BASE_PATH ?? "";

function cleanBasePath(basePath: string): string {
  if (!basePath) return "";
  if (!basePath.startsWith("/")) basePath = "/" + basePath;
  if (basePath.length >= 1 && basePath.endsWith("/")) basePath = basePath.slice(0, -1);
  return basePath;
}

function cleanInternalUrl(url: string): string {
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  return url;
}

function addBasePathToHost(host: string, basePath: string): string {
  const url = new URL(host);
  const currentPath = url.pathname;

  if (basePath) {
    if (!currentPath.startsWith(basePath)) {
      url.pathname = basePath;
    }
  } else {
    if (currentPath && currentPath !== "/") {
      url.pathname = "/";
    }
  }

  return url.toString();
}


let cachedInternalHost: string | null = null;
let cachedBasePath: string | null = null;

export default function getInternalUrl({ nextUrl }: GetInternalUrlProps = {}) {
  if (cachedInternalHost !== null && cachedBasePath !== null) {
    return {
      internalHost: cachedInternalHost,
      basePath: cachedBasePath,
    };
  }

  let internalHost = internalUrlEnv.trim();
  let basePath = cleanBasePath(basePathEnv.trim());

  if (!internalHost && nextUrl) {
    const protocol = nextUrl.protocol || "http:";
    const hostname = nextUrl.hostname;
    const port = nextUrl.port ? `:${nextUrl.port}` : "";
    internalHost = `${protocol}//${hostname}${port}`;
  }

  if (!internalHost) {
    throw new Error("Internal host is missing and nextUrl is not provided.");
  }

  internalHost = cleanInternalUrl(internalHost);

  try {
    internalHost = addBasePathToHost(internalHost, basePath);
  } catch (error) {
    console.error("Failed to format internal host correctly:", error);
  }

  internalHost = cleanInternalUrl(internalHost);

  // Set cache
  cachedInternalHost = internalHost;
  cachedBasePath = basePath;

  return {
    internalHost,
    basePath,
  };
}
