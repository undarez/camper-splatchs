import { createGlobalStyle } from "styled-components";

const AutocompleteStyles = createGlobalStyle`
  .geoapify-autocomplete-input {
    width: 100%;
    height: 2.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    background-color: transparent;
    border: none;
    outline: none;
    color: inherit;
  }

  .geoapify-autocomplete-items {
    position: absolute;
    width: 100%;
    background-color: var(--background);
    border: 1px solid var(--input);
    border-radius: 0.375rem;
    margin-top: 0.25rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    z-index: 50;
  }

  .geoapify-autocomplete-item {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    cursor: pointer;
  }

  .geoapify-autocomplete-item:hover {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }

  .geoapify-autocomplete-item:first-child {
    border-top-left-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
  }

  .geoapify-autocomplete-item:last-child {
    border-bottom-left-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
  }
`;

export default AutocompleteStyles;
