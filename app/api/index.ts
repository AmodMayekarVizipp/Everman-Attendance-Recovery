// const apiEndPoint = 'https://evermanprodapi.azurewebsites.net';
const apiEndPoint = 'https://evermanqaapifunction.azurewebsites.net';
const idx = 'tmwqrbauxjtlfrf';

// ----- Login  -----
export async function studentFormLogin(password: string) {
  const url = `${apiEndPoint}/api/StudentFormLogin?NewPassword=${encodeURIComponent(password)}&idx=${idx}`;
  const response = await fetch(url, {
    method: 'GET',
  });
  return response.json();
}

// ----- Get List of Defaulter by OtherId -----
export async function getDefaulterListByOtherId({
  year,
  semester,
  otherId,
}: {
  year: string;
  semester: string;
  otherId: string;
}) {
  const url = `${apiEndPoint}/api/DefaulterListByOtherId?Year=${encodeURIComponent(
    year
  )}&Semester=${encodeURIComponent(
    semester
  )}&OtherId=${encodeURIComponent(otherId)}&idx=${idx}`;
  const response = await fetch(url);
  return response.json();
}

// ----- save Attendance Time -----
export async function saveAttendanceTime({
  OtherId,
  Type,
  Year,
  Semester,
  AttendanceNote,
  CurrentTime,
  ParentEmail,
}: {
  OtherId: string | number;
  Type: 'IN' | 'OUT';
  Year: string;
  Semester: string;
  AttendanceNote?: string;
  CurrentTime?: string;
  ParentEmail?: string;
}) {
  const now = new Date().toISOString();
  const url = `${apiEndPoint}/api/SaveAttendanceTime?OtherId=${encodeURIComponent(
    OtherId
  )}&Type=${Type}&Year=${encodeURIComponent(Year)}&Semester=${encodeURIComponent(Semester)}&idx=${idx}`;

  const payload = {
    CurrentTime: CurrentTime || now,
    ParentEmail: ParentEmail || '',
    OtherId: OtherId,
    AttendanceNote: AttendanceNote || '',
    SelectedOtherId: OtherId,
    createddate: now,
    updateddate: now,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return response.json();
}
