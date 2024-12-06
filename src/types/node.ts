export interface Node {
  id: string;
  data: {
    label: string;
    name: string;
    color: string;
  };
  label: string;
  position: {
    x: number;
    y: number;
  };
}