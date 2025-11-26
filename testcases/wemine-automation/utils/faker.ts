let counter = 0;

export function fakeFormName(prefix = 'Equipment Inspection') {
  counter += 1;
  return `${prefix} #${counter}`;
}

export function fakeHazardDescription() {
  return `Auto-generated hazard ${++counter}`;
}