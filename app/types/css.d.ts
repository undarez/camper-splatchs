declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

declare module "leaflet/dist/leaflet.css";
declare module "@geoapify/geocoder-autocomplete/styles/minimal.css";
