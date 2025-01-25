import { Database, Zods } from "@/db/db";
import { sql } from "slonik";
import { z } from 'zod';


export class UserSearchCriteria {
  GoogleId: string | null = null;
  UserId: string | null = null;
}

export class User {
  UserId: number = 0;
  FirstName: string;
  LastName: string;
  Email: string;
  GoogleId: string;

  public constructor(firstName: string, lastName: string, email: string, GoogleId: string){
    this.FirstName = firstName;
    this.LastName = lastName;
    this.Email = email;
    this.GoogleId = GoogleId;
  }

  // creates a new or updates an exists user
  public async SaveUser(){
    const pool = await Database.getPool();
    
    if(this.UserId == 0){
      let result = await pool.one(
        sql.type(z.object({id: z.number()}))`
          INSERT INTO users (first_name, last_name, email, google_id)
            VALUES (${this.FirstName}, ${this.LastName}, ${this.Email}, ${this.GoogleId})
          RETURNING id;
        `);
      this.UserId = result.id;

    } else {
      let result = await pool.one(
        sql.type(z.object({id: z.number()}))`
          UPDATE users
          SET first_name = ${this.FirstName},
              last_name = ${this.LastName},
              email = ${this.Email},
          WHERE id = ${this.UserId}
          RETURNING id;
        `);
    }
  }

  public static async GetUser({SearchCriteria}: {SearchCriteria: UserSearchCriteria}): Promise<User | null> {
    const pool = await Database.getPool();

    try {
      let user = await pool.one(
        sql.type(Zods.userObj)`SELECT * FROM users
            WHERE google_id = ${SearchCriteria.GoogleId} 
          LIMIT 1;
        `);
  
      let NewUser = new User(user.first_name, user.last_name, user.email, user.google_id);
      NewUser.UserId = user.id;
  
      return NewUser;

    } catch {
      return null;
    }
  }

  public static async GetUsers({SearchCriteria}: {SearchCriteria: UserSearchCriteria}): Promise<User[]>  {



    return [];
  }

}

