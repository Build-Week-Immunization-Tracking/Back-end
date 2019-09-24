exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("immunizations")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("immunizations").insert([
        { name: "Hepatitis B Vaccine - (HepB)" },
        { name: "Rotavirus - (RV) RV1 (2-dose series); RV5 (3-dose series)" },
        { name: "Diphtheria, tetanus, & acellular pertussis - DTap" },
        { name: "Haemophilus influenzae type b - (Hib)" },
        { name: "Pneumococcal conjugate - (PCV13)" },
        { name: "Inactivated poliovirus - (IPV)" },
        { name: "Influenza - (IIV)" },
        { name: "Influenza - (LAIV)" },
        { name: "Measles, mumps, rubella - (MMR)" },
        { name: "Varicella - (VAR)" },
        { name: "Meningococcal - (MenACWY-D)" },
        { name: "Tetanus, diphtheria, & acellular pertussis - (Tdap)" },
        { name: "Human papillomavirus - (HPV)" },
        { name: "Meningococcal B - (MenB)" },
        { name: "Pneumococcal polysaccharide - (PPSV23)" }
      ]);
    });
};
