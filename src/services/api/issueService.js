import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class IssueService {
  constructor() {
    this.tableName = "issue_c";
  }

  getApperClient() {
    const client = getApperClient();
    if (!client) {
      throw new Error("ApperClient not initialized");
    }
    return client;
  }

  async getAll() {
    try {
      const apperClient = this.getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "assignee_c"}},
          {"field": {"Name": "reporter_c"}},
          {"field": {"Name": "labels_c"}},
{"field": {"Name": "Tags"}},
          {"field": {"Name": "comments_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return (response.data || []).map(this.transformFromDatabase);
    } catch (error) {
      console.error("Error fetching issues:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "assignee_c"}},
          {"field": {"Name": "reporter_c"}},
          {"field": {"Name": "labels_c"}},
{"field": {"Name": "Tags"}},
          {"field": {"Name": "comments_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        throw new Error(`Issue with ID ${id} not found`);
      }

      return this.transformFromDatabase(response.data);
    } catch (error) {
      console.error(`Error fetching issue ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(issueData) {
    try {
      const apperClient = this.getApperClient();
      const transformedData = this.transformToDatabase(issueData);
      
      const response = await apperClient.createRecord(this.tableName, {
        records: [transformedData]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Issue created successfully");
          return this.transformFromDatabase(successful[0].data);
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating issue:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, updateData) {
    try {
      const apperClient = this.getApperClient();
      const transformedData = this.transformToDatabase(updateData);
      transformedData.Id = parseInt(id);
      
      const response = await apperClient.updateRecord(this.tableName, {
        records: [transformedData]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Issue updated successfully");
          return this.transformFromDatabase(successful[0].data);
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating issue:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = this.getApperClient();
      const response = await apperClient.deleteRecord(this.tableName, {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Issue deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting issue:", error?.response?.data?.message || error);
      return false;
    }
  }

  async updateStatus(id, status) {
    return this.update(id, { status });
  }

  async updatePriority(id, priority) {
    return this.update(id, { priority });
  }

  async addComment(issueId, commentData) {
    try {
      const issue = await this.getById(issueId);
      if (!issue) {
        throw new Error(`Issue with ID ${issueId} not found`);
      }

      const existingComments = issue.comments || "";
      const newComment = `${commentData.author || "Current User"}: ${commentData.content}\n`;
      const updatedComments = existingComments + newComment;

      const updatedIssue = await this.update(issueId, { comments: updatedComments });
      
      if (updatedIssue) {
        toast.success("Comment added successfully");
      }

      return {
        id: `c${Date.now()}`,
        issueId: issueId.toString(),
        author: commentData.author || "Current User",
        content: commentData.content,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error adding comment:", error?.response?.data?.message || error);
      return null;
    }
  }

  async search(query) {
    try {
      if (!query || query.trim() === "") {
        return this.getAll();
      }

      const apperClient = this.getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "assignee_c"}},
          {"field": {"Name": "reporter_c"}},
{"field": {"Name": "Tags"}},
          {"field": {"Name": "labels_c"}},
          {"field": {"Name": "comments_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [{
            "conditions": [
              {
                "fieldName": "title_c",
                "operator": "Contains",
                "values": [query]
              },
              {
                "fieldName": "description_c",
                "operator": "Contains", 
                "values": [query]
              },
              {
                "fieldName": "assignee_c",
                "operator": "Contains",
                "values": [query]
              },
              {
                "fieldName": "labels_c",
                "operator": "Contains",
                "values": [query]
              }
            ],
            "operator": "OR"
          }]
        }],
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return (response.data || []).map(this.transformFromDatabase);
    } catch (error) {
      console.error("Error searching issues:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByFilters(filters) {
    try {
      const apperClient = this.getApperClient();
      let whereConditions = [];

      if (filters.status && filters.status.length > 0) {
        whereConditions.push({
          "FieldName": "status_c",
          "Operator": "ExactMatch",
          "Values": filters.status,
          "Include": true
        });
      }

      if (filters.priority && filters.priority.length > 0) {
        whereConditions.push({
          "FieldName": "priority_c",
          "Operator": "ExactMatch",
          "Values": filters.priority,
          "Include": true
        });
      }

      if (filters.type && filters.type.length > 0) {
        whereConditions.push({
          "FieldName": "type_c",
          "Operator": "ExactMatch",
          "Values": filters.type,
          "Include": true
        });
      }

      if (filters.assignee && filters.assignee.length > 0) {
        whereConditions.push({
          "FieldName": "assignee_c",
          "Operator": "ExactMatch",
          "Values": filters.assignee,
          "Include": true
        });
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "assignee_c"}},
          {"field": {"Name": "reporter_c"}},
{"field": {"Name": "Tags"}},
          {"field": {"Name": "labels_c"}},
          {"field": {"Name": "comments_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: whereConditions,
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return (response.data || []).map(this.transformFromDatabase);
    } catch (error) {
      console.error("Error filtering issues:", error?.response?.data?.message || error);
      return [];
    }
  }

transformFromDatabase = (dbRecord) => {
    return {
      Id: dbRecord.Id,
      title: dbRecord.title_c || "",
      description: dbRecord.description_c || "",
      type: dbRecord.type_c || "task",
      priority: dbRecord.priority_c || "medium",
status: dbRecord.status_c || "backlog",
      title: dbRecord.title_c || dbRecord.Name || "",
      description: dbRecord.description_c || "",
      reporter: dbRecord.reporter_c || "",
      labels: dbRecord.labels_c || [],
      comments: dbRecord.comments_c || [],
assignee: dbRecord.assignee_c || "",
reporter: dbRecord.reporter_c || "",
      labels: dbRecord.Tags ? dbRecord.Tags.split(',').filter(label => label.trim()) : [],
      comments: this.parseComments(dbRecord.comments_c || ""),
      CreatedOn: dbRecord.CreatedOn || new Date().toISOString(),
      createdAt: dbRecord.CreatedOn || new Date().toISOString(),
      updatedAt: dbRecord.ModifiedOn || new Date().toISOString(),
      attachments: []
    };
  }

  transformToDatabase = (frontendData) => {
    const dbData = {};
    
    if (frontendData.title !== undefined) dbData.title_c = frontendData.title;
    if (frontendData.description !== undefined) dbData.description_c = frontendData.description;
    if (frontendData.type !== undefined) dbData.type_c = frontendData.type;
    if (frontendData.priority !== undefined) dbData.priority_c = frontendData.priority;
if (frontendData.status !== undefined) dbData.status_c = frontendData.status;
    if (frontendData.title !== undefined) dbData.title_c = frontendData.title;
    if (frontendData.description !== undefined) dbData.description_c = frontendData.description;
    if (frontendData.reporter !== undefined) dbData.reporter_c = frontendData.reporter;
    if (frontendData.labels !== undefined) dbData.labels_c = frontendData.labels;
    if (frontendData.comments !== undefined) dbData.comments_c = frontendData.comments;
    if (frontendData.assignee !== undefined) dbData.assignee_c = frontendData.assignee;
    if (frontendData.reporter !== undefined) dbData.reporter_c = frontendData.reporter;
    if (frontendData.labels !== undefined) {
      dbData.labels_c = Array.isArray(frontendData.labels) 
        ? frontendData.labels.join(',') 
        : frontendData.labels;
    }
    if (frontendData.comments !== undefined) dbData.comments_c = frontendData.comments;

    return dbData;
  }

  parseComments(commentsString) {
    if (!commentsString || commentsString.trim() === "") {
      return [];
    }

    const commentLines = commentsString.split('\n').filter(line => line.trim());
    return commentLines.map((line, index) => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const author = line.substring(0, colonIndex).trim();
        const content = line.substring(colonIndex + 1).trim();
        return {
          id: `c${index + 1}`,
          issueId: "",
          author: author,
          content: content,
          createdAt: new Date().toISOString()
        };
      } else {
        return {
          id: `c${index + 1}`,
          issueId: "",
          author: "Unknown",
          content: line.trim(),
          createdAt: new Date().toISOString()
        };
      }
    });
  }
}

export default new IssueService();