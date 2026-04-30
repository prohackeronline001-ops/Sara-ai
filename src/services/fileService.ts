import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export async function createFolder(path: string) {
  try {
    await Filesystem.mkdir({
      path,
      directory: Directory.Documents,
      recursive: true,
    });
    return { success: true, message: `Folder "${path}" created successfully.` };
  } catch (error: any) {
    console.error('Create Folder Error:', error);
    return { success: false, message: `Failed to create folder: ${error.message}` };
  }
}

export async function createFile(path: string, content: string = "") {
  try {
    await Filesystem.writeFile({
      path,
      data: content,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
    return { success: true, message: `File "${path}" created successfully.` };
  } catch (error: any) {
    console.error('Create File Error:', error);
    return { success: false, message: `Failed to create file: ${error.message}` };
  }
}

export async function deleteFolder(path: string) {
  try {
    await Filesystem.rmdir({
      path,
      directory: Directory.Documents,
      recursive: true,
    });
    return { success: true, message: `Folder "${path}" deleted successfully.` };
  } catch (error: any) {
    console.error('Delete Folder Error:', error);
    return { success: false, message: `Failed to delete folder: ${error.message}` };
  }
}

export async function deleteFile(path: string) {
  try {
    await Filesystem.deleteFile({
      path,
      directory: Directory.Documents,
    });
    return { success: true, message: `File "${path}" deleted successfully.` };
  } catch (error: any) {
    console.error('Delete File Error:', error);
    return { success: false, message: `Failed to delete file: ${error.message}` };
  }
}

export async function listFiles(path: string = "") {
  try {
    const result = await Filesystem.readdir({
      path,
      directory: Directory.Documents,
    });
    return { success: true, files: result.files.map(f => f.name), message: `Listed files in "${path}".` };
  } catch (error: any) {
    console.error('List Files Error:', error);
    return { success: false, message: `Failed to list files: ${error.message}` };
  }
}
