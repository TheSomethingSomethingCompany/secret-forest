export default function getRandomProfilePicture() {
  const min = 1;
  const max = 17;
  const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
  return `/profile-pictures/${randomIndex}.svg`; 
}
