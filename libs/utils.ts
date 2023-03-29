export function cls(...classnames: string[]) {
  return classnames.join(" ");
}
export function isNullObj(obj: any) {
  return Object.keys(obj).length === 0;
}
