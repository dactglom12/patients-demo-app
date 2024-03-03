export const routes = {
  home: () => "/",
  patients: () => "/patients",
  specificPatient: (patientId: string) => `${routes.patients()}/${patientId}`,
  recentNotes: () => `${routes.patients()}/recent`,
};
