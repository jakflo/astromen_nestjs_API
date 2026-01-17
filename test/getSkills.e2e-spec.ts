import request from 'supertest';
import { addSkill, setupTestApp, httpServerHelper } from './tools';
import type { SkillsListItem } from '../src/skills/skills.service';
import { TestContext } from './types';

describe('GetSkills (e2e)', () => {
    const ctx = {} as TestContext;
    setupTestApp(ctx);

    it('/getSkills (5 polozek)', async () => {
        const conn = ctx.db.getConn();
        const skillnames = [] as string[];
        for (let c = 1; c <= 5; c++) {
            const skillname = `skill_${c}`;
            skillnames.push(skillname);
            await addSkill(skillname, ctx.app);
        }

        type respBody = { skills: SkillsListItem[] };
        const resp = await request(httpServerHelper(ctx.app))
            .get('/allSkills')
            .send()
            .expect(200);
        const body = resp.body as respBody;
        const skillsInResponse = body.skills;
        expect(skillsInResponse).toHaveLength(5);

        for (const skillname of skillnames) {
            const skillIdInResponse = skillsInResponse.filter((item: SkillsListItem) => item.name === skillname)[0].id;
            const skillIdInDb = (await conn('skill').where<SkillsListItem[]>('name', skillname).first()).id;
            expect(skillIdInResponse).toEqual(skillIdInDb);
        }
    });
});
