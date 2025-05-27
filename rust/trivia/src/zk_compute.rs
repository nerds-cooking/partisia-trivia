/// Submodule for MPC computations.
use create_type_spec_derive::CreateTypeSpec;
use pbc_zk::*;

// Fixed 20 length array of type Sbi8
type AnswersArr = [Sbi8; 20];

#[repr(C)]
#[derive(Debug, Clone, Copy, CreateTypeSpec, SecretBinary)]
pub struct Result {
    entry_var_id: SecretVarId,
    score: Sbi8
}


#[repr(C)]
#[derive(read_write_state_derive::ReadWriteState, Debug, Clone)]
pub struct GameMetadata {
    // length: u8
}

#[zk_compute(shortname = 0x70)]
pub fn calculate_results(
    answers_var_id: SecretVarId,
    entry_var_id: SecretVarId
) -> Sbi8 {
    let answers_metadata = load_metadata::<GameMetadata>(answers_var_id);
    let correct_answers = get_correct_answers(answers_var_id);

    let score = compute_score(
        entry_var_id,
        correct_answers,
        // answers_metadata.length
    );
    
    score
}

fn get_correct_answers(var_id: SecretVarId) -> AnswersArr {
    load_sbi::<AnswersArr>(var_id)
}

fn compute_score(entry_var_id: SecretVarId, correct_answers: AnswersArr
    // , question_count: u8
) -> Sbi8 {
    let entry = load_sbi::<AnswersArr>(entry_var_id);

    let mut score = Sbi8::from(0);

    // Compare answers
    // for i in 0..question_count {
    for i in 0..20 {
        let index = i as usize;

        if correct_answers[index] > Sbi8::from(0) {
            // we only check answers that are not 0 (0 is used as filler)
            let is_correct = entry[index] == correct_answers[index];
            if is_correct {
                score = score + Sbi8::from(1);
            }
        }

    }

    score
}