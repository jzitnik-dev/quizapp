import { Skeleton, Strong } from "@radix-ui/themes";
import React from "react";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const defaultLang = "en";
const supported = ["en", "cs"];

type LocalesDictType = { [id: string]: string };

interface LocalesType {
  locales: LocalesDictType;
  setLocales: (locales: LocalesDictType) => void;
  loading: boolean;
  error: Error | null;
}

const LocalesContext = createContext<LocalesType>({
  locales: {},
  setLocales: () => {},
  loading: true,
  error: null,
});

export default function LocalizationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [locales, setLocales] = useState<LocalesDictType>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLocalization = async () => {
    const userLang =
      localStorage.getItem("lang") || navigator.language.split("-")[0];
    const lang = supported.includes(userLang) ? userLang : defaultLang;

    try {
      const res = await fetch(`/localization/sources/${lang}.json`);
      setLocales(await res.json());
      setLoading(false);
    } catch (error: any) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchLocalization();
  }, []);

  return (
    <LocalesContext.Provider value={{ locales, setLocales, loading, error }}>
      {children}
    </LocalesContext.Provider>
  );
}

export function useChangeLang() {
  const { setLocales } = useLocales();

  return async (lang: string) => {
    const res = await fetch(`/localization/sources/${lang}.json`);
    setLocales(await res.json());
    localStorage.setItem("lang", lang);
  };
}

export function getCurrentLang() {
  const userLang =
    localStorage.getItem("lang") || navigator.language.split("-")[0];
  return supported.includes(userLang) ? userLang : defaultLang;
}

const useLocales = () => useContext(LocalesContext);

function formatStr(str: string, props: string[]) {
  // @ts-expect-error For some reason str.replace in typescript does not accept function, but this is valid JS.
  return str.replace(/{}/g, function () {
    return props.shift();
  });
}

export function GetString(key: string, props?: string[]) {
  const { locales, loading } = useLocales();

  if (loading) {
    return key;
  }

  return formatStr(locales[key], props || []) || key;
}

function formatStrReact(str: string) {
  const regex = /\*\*(.*?)\*\*/g;

  return str.split("\n").map((line: string, index: number) => {
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }

      parts.push(<Strong key={parts.length}>{match[1]}</Strong>);

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }

    return (
      <React.Fragment key={index}>
        {parts}
        {index !== str.split("\n").length - 1 && <br />}
      </React.Fragment>
    );
  });
}

export function LocalizationText({
  children,
  props = [],
}: {
  children: string;
  props?: string[];
}) {
  const { locales, loading } = useLocales();
  const key = children.trim();

  if (loading) {
    return <Skeleton />;
  }

  if (!locales[key]) {
    return key;
  }

  return formatStrReact(formatStr(locales[key], props));
}
