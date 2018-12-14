import React, { useContext, useState, useEffect, useMemo } from "react";
import invariant from "invariant";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

function detectViolations(Component = {}) {
  invariant(
    Component.Context,
    `You should define ${getDisplayName(Component)}.Context`
  );
  invariant(
    Component.createContext,
    `You should define ${getDisplayName(Component)}.createContext`
  );
}

export const createComponentProvider = (Component, options) => {
  detectViolations(Component);

  const Context = React.createContext();

  const Provider = ({ children, disable, optionsProp }) => {
    const contextValue = disable
      ? undefined
      : Component.createContext(optionsProp || options);

    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
  };

  Provider.Context = Context;
  Provider.createContext = Component.createContext;

  return Provider;
};

export const useComponentContext = (Component, Provider = {}) => {
  useMemo(() => detectViolations(Component));

  const { Context, createContext } = Component;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useContext(Provider.Context || Context) || useMemo(createContext);
};
