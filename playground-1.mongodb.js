/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('Escola');

// Limpar as coleções antes de inserir dados
db.getCollection('alunos').deleteMany({});
db.getCollection('cursos').deleteMany({});
db.getCollection('professores').deleteMany({});
db.getCollection('materias').deleteMany({});

// Insere dados na tabela alunos
db.getCollection('alunos').insertMany([
  { 'nome': 'Caio', 'RA': 22001562, 'curso':'Engenharia Mecânica'},
  { 'nome': 'Roberto', 'RA': 22003789, 'curso':'Engenharia Civil'},
  { 'nome': 'Lucas', 'RA': 22009431, 'curso':'Engenharia Mecânica'},
  { 'nome': 'Tina', 'RA': 22008421, 'curso':'Engenharia Eletrica'},
  { 'nome': 'Laura', 'RA': 22002763, 'curso':'Engenharia Eletrica'},
  { 'nome': 'Pietra', 'RA': 22007654, 'curso':'Engenharia Civil'},
  { 'nome': 'Pedro', 'RA': 22002685, 'curso':'Engenharia Mecânica'},
]);

// Insere as materias 
db.getCollection('materias').insertMany([
  { 'nome': 'UTILIZAÇÃO EFICIENTE DE ENERGIA', 'RM': 'P0120', 'cursos': 'Engenharia Eletrica', 'professor_m': 'Eduarda Martins' },
  { 'nome': 'PI: PROJETO ELETRÔNICO E DE AUTOMAÇÃO', 'RM': 'P0135', 'cursos': 'Engenharia Eletrica', 'professor_m': 'Gabriel Rodrigues' },
  { 'nome': 'ESTUDOS GEOTÉCNICOS A', 'RM': 'P0201', 'cursos': 'Engenharia Civil', 'professor_m': 'Michael Ferreira' },
  { 'nome': 'MÉTODOS DE CONSTRUIR', 'RM': 'P0101', 'cursos': 'Engenharia Civil', 'professor_m': 'Sara Costa' },
  { 'nome': 'MÁQUINAS DE TRAÇÃO ELÉTRICA', 'RM': 'P0203', 'cursos': 'Engenharia Mecânica', 'professor_m': 'Davi Fernandes' },
  { 'nome': 'PI: PROJETO MECÂNICO, INOVAÇÃO E EMPREENDEDORISMO', 'RM': 'P0301', 'cursos': 'Engenharia Mecânica', 'professor_m': 'Rachel Gomes' },
]);

// Insere os cursos
db.getCollection('cursos').insertMany([
  { 'nome': 'Engenharia Eletrica', 'code': 'ENGEL101', 'professores': ['Gabriel Rodrigues', 'Eduarda Martins'] },
  { 'nome': 'Engenharia Civil', 'code': 'ENCI201', 'professores': ['Michael Ferreira', 'Sara Costa'] },
  { 'nome': 'Engenharia Mecânica', 'code': 'ENME301', 'professores': ['Davi Fernandes', 'Rachel Gomes'] },
]);

// Insere os professores 
db.getCollection('professores').insertMany([
  { 'nome': 'Gabriel Rodrigues', 'professor_id': 'RS001', 'cursos': ['Engenharia Eletrica'] },
  { 'nome': 'Eduarda Martins', 'professor_id': 'ED002', 'cursos': ['Engenharia Eletrica'] },
  { 'nome': 'Michael Ferreira', 'professor_id': 'MJ003', 'cursos': ['Engenharia Civil'] },
  { 'nome': 'Sara Costa', 'professor_id': 'SB004', 'cursos': ['Engenharia Civil'] },
  { 'nome': 'Davi Fernandes', 'professor_id': 'DW005', 'cursos': ['Engenharia Mecânica'] },
  { 'nome': 'Rachel Gomes', 'professor_id': 'RT006', 'cursos': ['Engenharia Mecânica'] },
]);

// Função para imprimir dados em formato de tabela
function printTable(data) {
  // Verifica se há dados
  if (data.length === 0) {
      console.log("Nenhum dado disponivel.");
      return;
  }
  
  // Remove o campo _id do cabeçalho e dos dados
  const keys = Object.keys(data[0]).filter(key => key !== '_id');

  // Calcula a largura de cada coluna
  const columnWidths = {};
  keys.forEach(key => {
      const maxLength = Math.max(...data.map(item => String(item[key]).length));
      columnWidths[key] = Math.max(maxLength, key.length);
  });
  
  // Imprime cabeçalho da tabela
  const header = keys.map(key => key.padEnd(columnWidths[key])).join(" | ");
  console.log(header);

  // Imprime linha divisória
  const divider = keys.map(key => "-".repeat(columnWidths[key])).join("-|-");
  console.log(divider);

  // Imprime dados em formato de tabela
  data.forEach((item) => {
      const row = keys.map(key => String(item[key]).padEnd(columnWidths[key]));
      console.log(row.join(" | "));
  });
}

// Print all professors
const professores = db.getCollection('professores').find().toArray();
console.log("Professores:");
printTable(professores);

// Print all students
const alunos = db.getCollection('alunos').find().toArray();
console.log("\nAlunos:");
printTable(alunos);

// Iterar sobre cada aluno
alunos.forEach(aluno => {
  console.log('\nAluno: ' + aluno.nome + ', Curso: ' + aluno.curso);
  
  // Encontrar o curso do aluno
  const curso = db.getCollection('cursos').findOne({ nome: aluno.curso });
    if (curso) {
      // Encontrar os professores do curso
      const professoresDoCurso = db.getCollection('professores').find({ cursos: curso.nome }).toArray();
      if (professoresDoCurso.length > 0) {
        console.log("Professores:");
        professoresDoCurso.forEach(professor => {
          console.log(`${professor.nome}`);
        });
      } else {
        console.log("Nenhum professor encontrado para este curso.");
      }
    } else {
      console.log("Curso não encontrado para este aluno.");
    }
});

// Iterar sobre cada professor
professores.forEach(professor => {
  console.log('\nProfessor: ' + professor.nome + ',');
  
  // Encontrar os cursos ministrados pelo professor
  const cursosDoProfessor = db.getCollection('cursos').find({ professores: professor.nome }).toArray();
  
  if (cursosDoProfessor.length > 0) {
        cursosDoProfessor.forEach(curso => {
          // Encontrar os alunos matriculados no curso
          const alunosDoCurso = db.getCollection('alunos').find({ curso: curso.nome }).toArray();
          
          if (alunosDoCurso.length > 0) {
            console.log(`Curso: ${curso.nome}`);
            console.log("Alunos:");
            alunosDoCurso.forEach(aluno => {
              console.log(`- ${aluno.nome}`);
            });
          } else {
            console.log(`Nenhum aluno encontrado para o curso ${curso.nome}.`);
          }
        });
  } else {
      console.log("Nenhum curso encontrado para este professor.");
  }
});