// Public source list for Mount Isa Golf Club mapping validation.
// These are references only. Do not scrape private/paid data.

export type MappingSource = { name: string; url: string; use: string; restriction: string; };
export const mountIsaMappingSources: MappingSource[] = [
  { name: "Mount Isa Golf Club official site", url: "https://www.mountisagolfclub.com.au/", use: "Official club validation", restriction: "Do not copy website assets without permission." },
  { name: "Hole19 Mount Isa Golf Club", url: "https://www.hole19golf.com/courses/mount-isa-golf-club", use: "Confirms Mount Isa Golf Club is mapped and available in Hole19 app", restriction: "Do not scrape private app map data." },
  { name: "18Birdies Mount Isa Golf Club", url: "https://18birdies.com/golf-courses/club/ee85b390-a582-11e6-8139-0680a328ea36/mount-isa-golf-club", use: "Course metadata/listing validation", restriction: "Do not copy private app course assets." },
  { name: "GolfPass Mount Isa Golf Club", url: "https://www.golfpass.com/travel-advisor/courses/19530-mount-isa-golf-club", use: "Course metadata and satellite layout reference", restriction: "Use as reference only; do not copy proprietary imagery." },
  { name: "1Golf Mount Isa Golf Club", url: "https://www.1golf.eu/en/club/mount-isa-golf-club/", use: "Course length/par validation", restriction: "Reference only." }
];
