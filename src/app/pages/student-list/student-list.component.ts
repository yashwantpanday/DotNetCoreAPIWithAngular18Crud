import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-list.component.html'
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  formModel: Student = this.getEmptyStudent();
  successMessage: string = '';

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  getEmptyStudent(): Student {
    return {
      id: 0,
      studentName: '',
      studentGender: '',
      age: 0,
      standard: '',
      fatherName: ''
    };
  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe(data => {
      this.students = data;
    });
  }

  onSubmit(): void {
    if (this.formModel.id === 0) {
      // Create
      this.studentService.createStudent(this.formModel).subscribe(() => {
        this.successMessage = 'Student added successfully!';
        this.loadStudents();
        this.resetForm();
        this.clearMessage();
      });
    } else {
      // Update
      this.studentService.updateStudent(this.formModel.id, this.formModel).subscribe(() => {
        this.successMessage = 'Student updated successfully!';
        this.loadStudents();
        this.resetForm();
        this.clearMessage();
      });
    }
  }

  editStudent(student: Student): void {
    this.formModel = { ...student }; // shallow copy to avoid direct binding
  }

  deleteStudent(id: number): void {
    if (confirm('Are you sure you want to delete?')) {
      this.studentService.deleteStudent(id).subscribe(() => {
        this.successMessage = 'Student deleted successfully!';
        this.loadStudents();
        this.clearMessage();
      });
    }
  }

  resetForm(): void {
    this.formModel = this.getEmptyStudent();
  }

  clearMessage(): void {
    setTimeout(() => {
      this.successMessage = ''; // Clear the success message after 3 seconds
    }, 3000);
  }
}
