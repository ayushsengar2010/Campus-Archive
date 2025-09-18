// Type definitions as JSDoc comments for better IDE support

/**
 * @typedef {'student' | 'faculty' | 'admin' | 'researcher'} UserRole
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {UserRole} role
 * @property {string} department
 * @property {string} [avatar]
 * @property {Date} createdAt
 * @property {Date} lastLogin
 */

/**
 * @typedef {Object} FileAttachment
 * @property {string} id
 * @property {string} name
 * @property {string} url
 * @property {number} size
 * @property {string} type
 */

/**
 * @typedef {Object} SubmissionMetadata
 * @property {string} department
 * @property {string} [course]
 * @property {string} [semester]
 * @property {number} year
 */

/**
 * @typedef {Object} Feedback
 * @property {string} id
 * @property {string} submissionId
 * @property {string} facultyId
 * @property {string} content
 * @property {'approved' | 'rejected' | 'resubmit'} status
 * @property {FileAttachment[]} [attachments]
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Submission
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'project' | 'assignment' | 'research' | 'proposal'} type
 * @property {'pending' | 'approved' | 'rejected' | 'resubmit'} status
 * @property {string} studentId
 * @property {string} facultyId
 * @property {FileAttachment[]} files
 * @property {string} [githubLink]
 * @property {string} [doi]
 * @property {string[]} tags
 * @property {SubmissionMetadata} metadata
 * @property {Feedback[]} [feedback]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {Date} [dueDate]
 */

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} userId
 * @property {'submission' | 'feedback' | 'deadline' | 'system'} type
 * @property {string} title
 * @property {string} message
 * @property {boolean} read
 * @property {string} [actionUrl]
 * @property {Date} createdAt
 */

export {};