import * as FileSystem from "expo-file-system";

export async function findFileUri(dirUri: string, fileName: string) {
  const entries = await FileSystem.StorageAccessFramework.readDirectoryAsync(
    dirUri
  );
  return entries.find(
    (entry) => decodeURIComponent(entry.split("%2F").pop() ?? "") === fileName
  );
}

async function exists(uri: string, fileName: string = "") {
  try {
    if (!fileName) {
      await FileSystem.StorageAccessFramework.readDirectoryAsync(uri);
      return uri;
    } else {
      return await findFileUri(uri, fileName);
    }
  } catch (e) {
    console.log("no file or directory");
    return false;
  }
}
async function readDb() {
  return await FileSystem.readAsStringAsync(
    FileSystem.documentDirectory + "SQLite/main.db",
    {
      encoding: FileSystem.EncodingType.Base64,
    }
  );
}

export async function importDB() {
  let dir = "";
  const permissions =
    await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (!permissions.granted) {
    return;
  }
  dir = permissions.directoryUri;
  const fileUri = await exists(dir, "main.db");
  if (!fileUri) {
    return false;
  }
  const data = await FileSystem.StorageAccessFramework.readAsStringAsync(
    fileUri,
    {
      encoding: FileSystem.EncodingType.Base64,
    }
  );
  await FileSystem.writeAsStringAsync(
    FileSystem.documentDirectory + "SQLite/main.db",
    data,
    {
      encoding: FileSystem.EncodingType.Base64,
    }
  );
  return dir;
}
