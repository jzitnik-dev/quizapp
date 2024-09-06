import { Skeleton } from "@radix-ui/themes";
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

const useLocales = () => useContext(LocalesContext);

export function GetString(key: string) {
  const { locales, loading } = useLocales();

  if (loading) {
    return key;
  }

  return locales[key] || key;
}

export function LocalizationText({ children }: { children: string }) {
  const { locales, loading } = useLocales();
  const key = children.trim();

  if (loading) {
    return <Skeleton />;
  }

  return locales[key] || key;
}
