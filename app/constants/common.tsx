export const FONTS = {
    POPPINS_REGULAR: 'PoppinsRegular',
    POPPINS_BOLD: 'PoppinsBold',
    POPPINS_MEDIUM: 'PoppinsMedium',
    POPPINS_LIGHT: 'PoppinsLight',
};

export const COLORS = {
    PRIMARY: '#746EFF',
    WHITE : '#FFFFFF',
    LWHITE : '#F2F2F2',
};

export function formatDisplayTime(isoString: string) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
}