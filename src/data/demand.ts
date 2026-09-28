export type DemandRank = {
  title: string;
  level: 'HIGHEST' | 'VERY HIGH' | 'HIGH' | 'STEADY';
  body: string;
  covers?: string;
};

export type DemandPlace = {
  area: string;
  detail: string;
};

export type DemandHorizon = {
  title: string;
  places?: DemandPlace[];
  body?: string;
};

export type DemandPath = {
  title: string;
  detail: string;
};

export const DEMAND_BRIEF: {
  title: string;
  where: {
    heading: string;
    lead: string;
    modelLabel: string;
    model: string[];
    rankingLabel: string;
    ranks: DemandRank[];
    regional: string;
  };
  geography: {
    heading: string;
    horizons: DemandHorizon[];
  };
  progressions: {
    heading: string;
    rule: string;
    base: string;
    stackLabel: string;
    paths: DemandPath[];
  };
} = {
  title:
    'Wired for Demand: Industries, Hotspots and Progression Routes After Cert II',
  where: {
    heading: '1. Where demand is strongest',
    lead:
      'Electricians have been in persistent national shortage for 20+ years in every state/territory. 197,300 employed, 94% full-time, median $2,191/week.',
    modelLabel: 'Jobs and Skills Australia / Powering Skills Organisation model:',
    model: [
      '+32,000 electricians needed by 2030, +85,000 by 2050 just for net-zero',
      'Need 20,500 new apprentice starts per year 2024-2030, 40% above 2015-2023 average',
      '14,000 shortfall in energy sector alone by 2030, 34,000 by 2050',
      'Infrastructure Australia: 300,000 construction worker shortfall by mid-2027, including 126,000 trades/labourers',
    ],
    rankingLabel: 'Ranking of your Cert II pathways:',
    ranks: [
      {
        title: 'General electrician -> renewables / storage / electrification',
        level: 'HIGHEST',
        body:
          'Construction of generation + transmission has to triple from 21,500 to 59,300 workers by 2030. 450,000 jobs in clean energy construction by 2030. Rooftop solar + distributed batteries alone = 27-43% of all electricity sector jobs to 2050, and steady, not boom-bust.',
        covers:
          'solar farm, wind farm, big batteries, transmission, rooftop solar/battery, EV chargers, heat pumps, switchboard upgrades, home/business electrification.',
      },
      {
        title: 'Industrial / mining / infrastructure electrician',
        level: 'VERY HIGH',
        body:
          'Data centres: 165 operating today ~3% of NEM use, 225 in development. Forecast 7.8% by 2030, 13% by 2036 = as much as all homes in NSW+VIC. NSW holds 66% of load, VIC 30%. Plus: hospitals, housing, AUKUS Osborne shipyard SA, Brisbane Olympics 2032 build - QLD labour demand 126,600 to 148,300 peak 2027-28.',
      },
      {
        title: 'Refrigeration / HVAC electrical',
        level: 'HIGH',
        body:
          'Counted in energy sector workforce. Heat pumps, refrigerated data centres, cold chain all grow with electrification and data boom.',
      },
      {
        title: 'Data / security / AV / controls',
        level: 'STEADY',
        body:
          'NBN, 5G, CCTV/access control, building automation steady work, but not the shortage-driver that energy is.',
      },
    ],
    regional:
      'Regional vs city: large-scale renewables are regional, city projects compete for same sparkies. Expect FIFO/regional premiums for Renewable Energy Zones and transmission corridors.',
  },
  geography: {
    heading: '2. Geographically, 5-10-20 years',
    horizons: [
      {
        title: 'Next 5 years to ~2031 - construction peak',
        places: [
          {
            area: 'NSW - Sydney/Wollongong/Newcastle/Hunter',
            detail:
              '15 data centre projects $51.9b + 90 operating, transmission, Snowy 2.0, housing. Data centres 4% to 11% of NSW power by 2030.',
          },
          {
            area: 'VIC - Melbourne/Geelong/Gippsland',
            detail:
              '50+ data centres, Big Build, offshore wind, $5.5m Sustainable Data Centre plan. Data centres 2% to 8% of VIC power by 2030.',
          },
          {
            area: 'QLD - Brisbane/SE + REZs',
            detail: 'Olympics build, solar/wind, 18,000 avg renewable jobs/yr.',
          },
          {
            area: 'WA - Perth/Pilbara',
            detail:
              'mining decarbonisation, gold boom. Fortescue alone wants 1,800 electricians at peak, opened Perth Power Up Centre - "can\'t hire our way out".',
          },
          {
            area: 'SA - Adelaide/Whyalla/Port Augusta',
            detail: 'AUKUS, hydrogen, large solar + storage.',
          },
        ],
      },
      {
        title: '10 years to ~2036 - shift to fit-out + O&M',
        body:
          'Construction jobs peak then fall, O&M jobs endure for 25-year asset life. By 2033 most renewable jobs are operations/maintenance. Distributed batteries, EV servicing, building retrofits dominate in cities.',
      },
      {
        title: '20 years to ~2046 - maintenance + repowering',
        body:
          'Licensed electricians, mechanical trades, electrical engineers stay in demand because they do O&M. Extra upside if Green Energy Exports / hydrogen superpower happens: 63,000 extra workers by 2029, up to 119,000-237,000 total - 15,000+ electricians. Decommissioning/recycling, grid modernisation, automation rebuilds.',
      },
    ],
  },
  progressions: {
    heading: '3. Progressions for ambitious people',
    rule: 'Cert II > Cert III Apprenticeship is mandatory for licensed work.',
    base: 'Base: UEE30820 Cert III Electrotechnology Electrician -> A-Grade licence',
    stackLabel: 'Then stack:',
    paths: [
      {
        title: 'High-voltage / mining',
        detail:
          'HV switching, hazardous areas, PLC - FIFO $110k-$150k+, Fortescue/BHP/Rio decarb fleets',
      },
      {
        title: 'Renewables specialist',
        detail:
          'Grid-connect solar, battery storage, EV - Clean Energy Council accreditation -> designer, operations manager $120k-$150k',
      },
      {
        title: 'Dual trade premium',
        detail:
          'Electrician + Refrigeration, or + Instrumentation UEE40420 Cert IV / UEE50220 Diploma. Instrumentation + automation is the 20-year automation-proof path.',
      },
      {
        title: 'Building services',
        detail:
          'Fire/security, data, KNX/BMS, lifts UEE33020. Data centre commissioning electricians are scarce now.',
      },
      {
        title: 'Contractor / business',
        detail:
          'Cert IV Electrical contracting + contractors licence -> run SME. Small solar/battery firms <20 staff employ most rooftop workers.',
      },
      {
        title: 'Management / professional',
        detail:
          'Diploma -> Advanced Diploma UEE60220 -> Electrical Engineering degree, project manager, estimator, energy auditor, net-zero consultant, network engineer.',
      },
    ],
  },
};
