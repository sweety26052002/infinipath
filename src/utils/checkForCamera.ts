export const checkForCamera = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(
      (device) => device.kind === "videoinput",
    );
    if (videoDevices.length > 0) {
      console.log("Camera found");
      return true;
    } else {
      console.log("No camera found");
      return false;
    }
  } catch (error) {
    console.error("Error checking for camera:", error);
    return false;
  }
};
