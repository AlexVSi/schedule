import { makeAutoObservable } from 'mobx';
import { IAcademicSubject, IGroup, ISchedule } from '@app/types/types';
import AcademicSubjectService from '@entities/academicSubject/api/AcademicSubject.service';


export default class AcademicSubjectStore {
    groupAcademicSubjects = [] as IAcademicSubject[];

    constructor() {
        makeAutoObservable(this)
    }

    setAcademicSubjects(groupAcademicSubjects: IAcademicSubject[]) {
        this.groupAcademicSubjects = groupAcademicSubjects
    }

    async fetchAllGroups() {
        try {
            const responce = await AcademicSubjectService.getAll()
            this.setAcademicSubjects(responce.data.subjects)
        } catch (e) {
            console.log(e)
        }
    }

    async fetchAllBySchedule(id: ISchedule['id']) {
        try {
            const responce = await AcademicSubjectService.getAllBySchedule(id)
            this.setAcademicSubjects(responce.data.subjects)
        } catch (e) {
            console.log(e)
        }
    }

    async fetchAllByGroupAndSchedule(groupId: IGroup['id'], scheduleId: ISchedule['id']) {
        try {
            const responce = await AcademicSubjectService.getAllByGroupAndSchedule(groupId, scheduleId)
            this.setAcademicSubjects(responce.data.subjects)
        } catch (e) {
            console.log(e)
        }
    }

    async add(body: Omit<IAcademicSubject, 'id'>) {
        try {
            const response = await AcademicSubjectService.add(body)
            await this.fetchAllByGroupAndSchedule(body.groupId, body.schedulesId)
            return response.data.id
        } catch (e) {
            console.log(e);
        }
    }

    async edit(body: Partial<IAcademicSubject>) {
        try {
            await AcademicSubjectService.edit(body)
            await this.fetchAllByGroupAndSchedule(body.groupId!, body.schedulesId!)
        } catch (e) {
            console.log(e);
        }
    }

    async remove(id: IAcademicSubject['id']) {
        try {
            await AcademicSubjectService.remove(id)
            this.setAcademicSubjects(this.groupAcademicSubjects.filter(a => a.id !== id))
        } catch (e) {
            console.log(e);
        }
    }
}