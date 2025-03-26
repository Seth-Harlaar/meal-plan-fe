import { Database, UserResultType, Zods } from "@/db/db";
import { sql } from "slonik";
import { z } from 'zod';


export class UserSearchCriteria {
  GoogleId: string = "";
  Email: string = "";
  UserId: number = 0;

  constructor(init?: Partial<UserSearchCriteria>){
    Object.assign(this, init);
  }
}

export class User {
  UserId: number = 0;
  FirstName: string = "";
  LastName: string = "";
  Email: string = "";
  GoogleId: string = "";
  CurrentMealplanID: number = 0;

  // creates a new or updates an exists user
  public async SaveUser(){
    const pool = await Database.getPool();
    
    if(this.UserId == 0){
      let result = await pool.one(
        sql.type(z.object({id: z.number()}))`
          INSERT INTO users (first_name, last_name, email, google_id, current_mealplan_id)
            VALUES (${this.FirstName}, ${this.LastName}, ${this.Email}, ${this.GoogleId}, ${this.CurrentMealplanID})
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
              current_mealplan_id = ${this.CurrentMealplanID}
          WHERE id = ${this.UserId}
          RETURNING id;
        `);
    }
  }

  public static async GetUser(SearchCriteria: UserSearchCriteria): Promise<User | null> {
    
    console.log('*** SearchCriteria1 ***')
    console.log(SearchCriteria)
    let users = await User.GetUsers(SearchCriteria);
    if(await users.length == 1)
      return users[0];
    return null;
  }

  public static async GetUsers(InputCriteria: UserSearchCriteria): Promise<User[]>  {
    const DefaultCriteria = new UserSearchCriteria();
    const Criteria = {...DefaultCriteria, ...InputCriteria };
    const pool = await Database.getPool();
      
    console.log('*** SearchCriteria1 ***')
    console.log(Criteria)
    const query = sql.type(Zods.userObj)`
      SELECT * FROM users
        WHERE 1= 1

        ${ // user id
          (Criteria.UserId > 0)
        ? sql.fragment`AND id = ${Criteria.UserId}`
        : sql.fragment`` }

        ${ // google id
          (Criteria.GoogleId.length > 0)
        ? sql.fragment`AND google_id LIKE ${'%' + Criteria.GoogleId + '%'}`
        : sql.fragment`` }

        ${ // email
          (Criteria.Email.length > 0)
        ? sql.fragment`AND email LIKE ${'%' + Criteria.Email + '%'}`
        : sql.fragment`` }

      ORDER BY id;
    `

    try {
      let users = await pool.any(query);
      console.log(users);
      return users.map(u => User.Deserialize(u));
    } catch(e) {
      console.log('error while searching for users: ', e);
      return [];
    }
  }

  public static Deserialize(user: UserResultType): User{
    return Object.assign(new User(), {
      UserId: user.id,
      GoogleId: user.google_id,
      FirstName: user.first_name,
      LastName: user.last_name,
      Email: user.email,
      CurrentMealplanID: user.current_mealplan_id,
    });
  }


  public static Serialize(user: User):UserResultType{
    return {
      id: user.UserId,
      google_id: user.GoogleId,
      first_name: user.FirstName,
      last_name: user.LastName,
      email: user.Email,
      current_mealplan_id: user.CurrentMealplanID,
    }
  }

}

