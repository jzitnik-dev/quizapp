import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

let navigateFunction: any;

export const useGlobalNavigate = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigateFunction = navigate;
  }, [navigate]);
};

export const globalNavigate = (path: string) => {
  if (navigateFunction) {
    navigateFunction(path);
  } else {
    console.error("Navigate function is not available");
  }
};
