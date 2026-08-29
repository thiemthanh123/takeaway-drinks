import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ResponseData } from "../app/shared/types/responseData";
import { Observable } from "rxjs";
import { BlogItem, ProductItems } from "../app/shared/types/productitem";

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  constructor(private http: HttpClient) {}

  getBlogs(): Observable<ResponseData<ProductItems[]>> {
    return this.http.get<ResponseData<ProductItems[]>>('https://ninedev-api.vercel.app/blogs');
  }

  detailBlog(id: number) : Observable<ResponseData<ProductItems>> {
    return this.http.get<any>(`https://ninedev-api.vercel.app/blogs/${id}`);
  }

  postBlog(blogItem: BlogItem) : Observable<ResponseData<ProductItems>> {
    return this.http.post<ResponseData<ProductItems>>("https://ninedev-api.vercel.app/blogs", blogItem);
  }

  deleteBlog(id: number) : Observable<ResponseData<ProductItems>> {
    return this.http.delete<any>(`https://ninedev-api.vercel.app/blogs/${id}`);
  }
}