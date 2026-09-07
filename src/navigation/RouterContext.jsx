import React, { createContext, useContext, useState, useEffect } from 'react';

const RouterContext = createContext();

export const RouterProvider = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => useContext(RouterContext);

export const Link = ({ to, children, className = '', style = {}, onClick, ...props }) => {
  const { navigate, currentPath } = useRouter();
  const isActive = currentPath === to || (to !== '/' && currentPath.startsWith(to));

  const handleClick = (e) => {
    // If command/ctrl key clicked, let browser open new tab
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    navigate(to);
    if (onClick) onClick(e);
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className={className}
      style={{
        textDecoration: 'none',
        ...style
      }}
      data-active={isActive ? 'true' : 'false'}
      {...props}
    >
      {children}
    </a>
  );
};
