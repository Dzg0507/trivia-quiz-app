export const skills = [
  {
    id: 'time_warp',
    name: 'Time Warp',
    description: 'Adds 5 seconds to the question timer.',
    cost: 100,
    dependencies: [],
  },
  {
    id: 'mind_reader',
    name: 'Mind Reader',
    description: 'Removes one incorrect answer.',
    cost: 250,
    dependencies: ['time_warp'],
  },
  {
    id: 'double_or_nothing',
    name: 'Double or Nothing',
    description: 'Risk your quiz score on the final question for double points.',
    cost: 500,
    dependencies: ['mind_reader'],
  },
];
