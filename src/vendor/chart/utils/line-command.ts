import { OrderedPair } from '../types';

// Linear function
export default function lineCommand(point: OrderedPair): string {
  return `L ${point[0]} ${point[1]}`;
}
