import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private readonly IMGBB_API_KEY = environment.imgbbApiKey;
  private readonly UPLOAD_URL = 'https://api.imgbb.com/1/upload';

  constructor(private http: HttpClient) {}

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  uploadImage(file: File): Observable<string> {
    return from(this.convertFileToBase64(file)).pipe(
      switchMap((base64String) => {
        const formData = new FormData();
        formData.append('key', this.IMGBB_API_KEY);
        formData.append('image', base64String);

        return this.http.post(this.UPLOAD_URL, formData).pipe(
          map((response: any) => {
            if (response.data && response.data.display_url) {
              return response.data.display_url;
            }
            throw new Error('Invalid response from ImgBB API');
          })
        );
      })
    );
  }

  uploadMultipleImages(files: File[]): Observable<string[]> {
    const uploads = files.map((file) => this.uploadImage(file));
    return forkJoin(uploads);
  }
}
