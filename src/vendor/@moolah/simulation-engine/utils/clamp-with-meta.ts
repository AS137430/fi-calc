interface ClampWithMetaReturn {
  val: number;
  minimumApplied: boolean;
  maximumApplied: boolean;
}

export default function clampWithMeta(
  val: number,
  min: number,
  max: number
): ClampWithMetaReturn {
  if (val < min) {
    return {
      val: min,
      minimumApplied: true,
      maximumApplied: false,
    };
  } else if (val > max) {
    return {
      val: max,
      minimumApplied: false,
      maximumApplied: true,
    };
  }

  return {
    val,
    minimumApplied: false,
    maximumApplied: false,
  };
}
