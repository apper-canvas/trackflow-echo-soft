import issuesData from "@/services/mockData/issues.json";

// Simulate API delays for realistic loading states
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class IssueService {
  constructor() {
    this.issues = [...issuesData];
  }

  async getAll() {
    await delay(300);
    return [...this.issues];
  }

  async getById(id) {
    await delay(200);
    const issue = this.issues.find(issue => issue.Id === parseInt(id));
    if (!issue) {
      throw new Error(`Issue with ID ${id} not found`);
    }
    return { ...issue };
  }

  async create(issueData) {
    await delay(400);
    
    const newIssue = {
      Id: Math.max(...this.issues.map(i => i.Id)) + 1,
      title: issueData.title,
      description: issueData.description || "",
      type: issueData.type || "task",
      priority: issueData.priority || "medium",
      status: issueData.status || "backlog",
      assignee: issueData.assignee || "",
      reporter: issueData.reporter || "Current User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      labels: issueData.labels || [],
      comments: [],
      attachments: []
    };
    
    this.issues.push(newIssue);
    return { ...newIssue };
  }

  async update(id, updateData) {
    await delay(300);
    
    const index = this.issues.findIndex(issue => issue.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Issue with ID ${id} not found`);
    }
    
    const updatedIssue = {
      ...this.issues[index],
      ...updateData,
      Id: parseInt(id), // Ensure ID remains an integer
      updatedAt: new Date().toISOString()
    };
    
    this.issues[index] = updatedIssue;
    return { ...updatedIssue };
  }

  async delete(id) {
    await delay(250);
    
    const index = this.issues.findIndex(issue => issue.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Issue with ID ${id} not found`);
    }
    
    const deletedIssue = { ...this.issues[index] };
    this.issues.splice(index, 1);
    return deletedIssue;
  }

  async updateStatus(id, status) {
    await delay(200);
    return this.update(id, { status });
  }

  async updatePriority(id, priority) {
    await delay(200);
    return this.update(id, { priority });
  }

  async addComment(issueId, commentData) {
    await delay(250);
    
    const issue = await this.getById(issueId);
    const newComment = {
      id: `c${Date.now()}`,
      issueId: issueId.toString(),
      author: commentData.author || "Current User",
      content: commentData.content,
      createdAt: new Date().toISOString()
    };
    
    const comments = [...(issue.comments || []), newComment];
    await this.update(issueId, { comments });
    
    return newComment;
  }

  async search(query) {
    await delay(200);
    
    if (!query || query.trim() === "") {
      return [...this.issues];
    }
    
    const searchTerm = query.toLowerCase();
    return this.issues.filter(issue => 
      issue.title.toLowerCase().includes(searchTerm) ||
      issue.description.toLowerCase().includes(searchTerm) ||
      issue.labels.some(label => label.toLowerCase().includes(searchTerm)) ||
      issue.assignee.toLowerCase().includes(searchTerm) ||
      issue.reporter.toLowerCase().includes(searchTerm)
    );
  }

  async getByFilters(filters) {
    await delay(250);
    
    let filteredIssues = [...this.issues];
    
    if (filters.status && filters.status.length > 0) {
      filteredIssues = filteredIssues.filter(issue => 
        filters.status.includes(issue.status)
      );
    }
    
    if (filters.priority && filters.priority.length > 0) {
      filteredIssues = filteredIssues.filter(issue => 
        filters.priority.includes(issue.priority)
      );
    }
    
    if (filters.type && filters.type.length > 0) {
      filteredIssues = filteredIssues.filter(issue => 
        filters.type.includes(issue.type)
      );
    }
    
    if (filters.assignee && filters.assignee.length > 0) {
      filteredIssues = filteredIssues.filter(issue => 
        filters.assignee.includes(issue.assignee)
      );
    }
    
    return filteredIssues;
  }
}

export default new IssueService();