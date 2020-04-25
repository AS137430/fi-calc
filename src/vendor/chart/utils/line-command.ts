import { OrderedPair } from '../types';

// This command connects two points linearly (no smoothing)
export default function lineCommand(point: OrderedPair): string {
  return `L ${point[0]} ${point[1]}`;
}
