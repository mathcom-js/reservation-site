export function cls(...classnames: string[]) {
  return classnames.join(" ");
}

export function createImageUrl(id: string, variants: string | undefined) {
  return variants
    ? `https://imagedelivery.net/BDH_sV5MMFDjmj9Ky8ZKTQ/${id}/${variants}`
    : `https://imagedelivery.net/BDH_sV5MMFDjmj9Ky8ZKTQ/${id}/public`;
}
