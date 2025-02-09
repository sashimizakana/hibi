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

export async function exportDB(exportDirectory: string) {
  let dir = "";
  if (exportDirectory) {
    if (await exists(exportDirectory)) {
      dir = exportDirectory;
    }
  }
  if (!dir) {
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      return;
    }
    dir = permissions.directoryUri;
  }
  const existFileUri = await exists(dir, "main.db");
  if (existFileUri) {
    //先に削除する
    try {
      await FileSystem.StorageAccessFramework.deleteAsync(existFileUri);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  try {
    const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
      dir,
      "main.db",
      "application/x-sqlite3"
    );
    await FileSystem.StorageAccessFramework.writeAsStringAsync(
      fileUri,
      await readDb(),
      {
        encoding: FileSystem.EncodingType.Base64,
      }
    );
    return dir;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
