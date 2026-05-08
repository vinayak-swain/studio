
import { Octokit } from "@octokit/rest";

/**
 * Imports a repository from GitHub using the provided access token.
 */
export async function importFromGitHub(
  token: string,
  owner: string,
  repo: string
) {
  const octokit = new Octokit({ auth: token });
  
  // Get repository metadata
  const { data: repoData } = await octokit.repos.get({ owner, repo });
  
  // Get default branch reference
  const { data: ref } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${repoData.default_branch}`
  });
  
  // Get full file tree recursively
  const { data: tree } = await octokit.git.getTree({
    owner,
    repo,
    tree_sha: ref.object.sha,
    recursive: "true"
  });
  
  // Download all files (blobs) in the tree
  const files = await Promise.all(
    tree.tree
      .filter(item => item.type === "blob")
      .map(async (item) => {
        try {
          const { data: blob } = await octokit.git.getBlob({
            owner,
            repo,
            file_sha: item.sha!
          });
          
          return {
            path: item.path!,
            content: Buffer.from(blob.content, "base64").toString("utf-8")
          };
        } catch (e) {
          console.error(`Failed to download ${item.path}`, e);
          return null;
        }
      })
  );
  
  // Get recent commit history
  const { data: commits } = await octokit.repos.listCommits({
    owner,
    repo,
    per_page: 50
  });
  
  return {
    repo: repoData,
    files: files.filter(f => f !== null),
    commits,
    branch: repoData.default_branch
  };
}
