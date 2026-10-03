import { randomUUID } from "crypto";
import { getDb } from "./db";
import type { User } from "@/types";
export function recordActivity(user: User, action: string, resource: string) {
  getDb()
    .prepare(
      "INSERT INTO audit_logs (id,user_id,user_name,action,resource,created_at) VALUES (?,?,?,?,?,?)",
    )
    .run(
      randomUUID(),
      user.id,
      `${user.firstName} ${user.lastName}`,
      action,
      resource,
      new Date().toISOString(),
    );
}
