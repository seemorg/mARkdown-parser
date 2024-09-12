export function rsplit(
  str: string,
  separator: string,
  limit: number
): string[] {
  // Split the string using the separator
  const parts = str.split(separator);

  // If the number of parts is less than or equal to the limit, return as is
  if (parts.length <= limit) {
    return parts;
  }

  // Join the first part of the array before the limit, keep the rest separately
  const result = [
    parts.slice(0, -limit).join(separator), // All parts before the last 'limit' items
    ...parts.slice(-limit), // The last 'limit' parts
  ];

  return result;
}
